import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { BeforeAfterSlider } from '../components/gallery/BeforeAfterSlider';
import { EXPLORE_CONCEPTS, getFallbackMedia } from '../data/exploreCatalog';
import { navigateTo } from '../features/navigation/navigationSlice';
import { useAppDispatch } from '../store/hooks';
import {
  INTERIOR_STYLES,
  ROOM_TYPES,
  type InteriorStyleFilter,
  type RoomTypeFilter,
} from '../types/explore';

export function ExploreScreen() {
  const dispatch = useAppDispatch();
  const [room, setRoom] = useState<RoomTypeFilter>('All Rooms');
  const [style, setStyle] = useState<InteriorStyleFilter>('All Styles');
  const [featuredId, setFeaturedId] = useState(EXPLORE_CONCEPTS[0].id);

  const featuredList = EXPLORE_CONCEPTS.filter((item) => item.featured);
  const activeFeatured =
    EXPLORE_CONCEPTS.find((item) => item.id === featuredId) ?? EXPLORE_CONCEPTS[0];

  const filtered = EXPLORE_CONCEPTS.filter(
    (item) =>
      (room === 'All Rooms' || item.roomType === room) &&
      (style === 'All Styles' || item.interiorStyle === style),
  );

  return (
    <Box sx={{ bgcolor: '#F4F1EA', color: '#191B1A', py: 5, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Explore Room Concepts
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'rgba(25, 27, 26, 0.78)' }}>
          Compare original spaces with curated demo previews before creating your project.
        </Typography>

        
        <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, mb: 4 }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: 'wrap' }}>
            {featuredList.map((item) => (
              <Button
                key={item.id}
                size="small"
                variant={item.id === activeFeatured.id ? 'contained' : 'outlined'}
                onClick={() => setFeaturedId(item.id)}
                sx={{ minHeight: 44, textTransform: 'none' }}
              >
                {item.title}
              </Button>
            ))}
          </Stack>

          <BeforeAfterSlider
            title={activeFeatured.title}
            beforeSrc={activeFeatured.beforeImage}
            afterSrc={activeFeatured.afterImage}
            beforeAlt={activeFeatured.beforeAlt}
            afterAlt={activeFeatured.afterAlt}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {activeFeatured.summary}
          </Typography>
        </Box>

       
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200, bgcolor: '#FFFFFF' }}>
            <InputLabel id="room-filter">Room Type</InputLabel>
            <Select
              labelId="room-filter"
              value={room}
              label="Room Type"
              onChange={(e) => setRoom(e.target.value as RoomTypeFilter)}
            >
              {ROOM_TYPES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200, bgcolor: '#FFFFFF' }}>
            <InputLabel id="style-filter">Interior Style</InputLabel>
            <Select
              labelId="style-filter"
              value={style}
              label="Interior Style"
              onChange={(e) => setStyle(e.target.value as InteriorStyleFilter)}
            >
              {INTERIOR_STYLES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(room !== 'All Rooms' || style !== 'All Styles') && (
            <Button
              onClick={() => {
                setRoom('All Rooms');
                setStyle('All Styles');
              }}
              sx={{ minHeight: 44, textTransform: 'none' }}
            >
              Reset filters
            </Button>
          )}
        </Stack>

       
        {filtered.length === 0 ? (
          <Box sx={{ bgcolor: '#FFFFFF', p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography sx={{ mb: 2 }}>No concepts match the selected filters.</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setRoom('All Rooms');
                setStyle('All Styles');
              }}
              sx={{ minHeight: 44, bgcolor: '#191B1A', textTransform: 'none' }}
            >
              Show all
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {filtered.map((item) => (
              <Card key={item.id} sx={{ bgcolor: '#FFFFFF' }}>
                <Box
                  component="img"
                  src={item.afterImage}
                  alt={item.afterAlt}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackMedia(item.title, 'after');
                  }}
                  sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                />
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={item.roomType} size="small" />
                    <Chip label={item.interiorStyle} size="small" />
                    <Chip label="Demo preview" size="small" sx={{ bgcolor: '#B87957', color: '#FFFFFF' }} />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5 }}>
                    {item.summary}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Est. {item.estimatedTier}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        
        <Box
          sx={{
            mt: 5,
            p: 3,
            borderRadius: 2,
            bgcolor: '#191B1A',
            color: '#F4F1EA',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6">Ready to start your own room project?</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(244, 241, 234, 0.8)' }}>
              Open the Studio wizard to create and save your brief.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => dispatch(navigateTo('studio'))}
            sx={{
              minHeight: 44,
              bgcolor: '#B87957',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#a46949' },
            }}
          >
            Create Project
          </Button>
        </Box>
      </Container>
    </Box>
  );
}