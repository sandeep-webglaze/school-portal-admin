import { Box, Paper, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

/**
 * SerpPreview — renders a live Google search-result mock for the current
 * meta title, description, and URL.
 *
 * Helps content writers see exactly how the page will appear in Google
 * BEFORE publishing, so they can tweak the title/description until it
 * looks right.
 *
 * Approximate truncation rules (mirror Google's behaviour as of 2025):
 *   - Title:       ~60 chars on desktop, ~52 on mobile (we use 60)
 *   - Description: ~160 chars on desktop (truncated mid-word with "…")
 *   - URL:         displayed as breadcrumb: site › path
 *
 * Usage:
 *   <SerpPreview
 *     title={values.slugMetaData.title}
 *     description={values.slugMetaData.description}
 *     slug={values.slug}
 *   />
 */

type SerpPreviewProps = {
  title?: string;
  description?: string;
  /** Page slug — combined with site base URL into the breadcrumb display. */
  slug?: string;
  /** Optional override for the site root shown in the URL breadcrumb. */
  siteUrl?: string;
};

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;
const DEFAULT_SITE = 'https://educationportal.ae';

function truncate(input: string, limit: number): string {
  if (!input) return '';
  if (input.length <= limit) return input;
  // Cut at last whole word before the limit so we don't slice mid-word.
  const trimmed = input.slice(0, limit);
  const lastSpace = trimmed.lastIndexOf(' ');
  const safe = lastSpace > limit * 0.6 ? trimmed.slice(0, lastSpace) : trimmed;
  return `${safe.trim()}…`;
}

const SerpPreview: FC<SerpPreviewProps> = ({
  title,
  description,
  slug,
  siteUrl = DEFAULT_SITE
}) => {
  const displayTitle = useMemo(
    () => truncate(title?.trim() || 'Untitled page — meta title missing', TITLE_LIMIT),
    [title]
  );

  const displayDescription = useMemo(
    () =>
      truncate(
        description?.trim() ||
          'No meta description set yet. Google will pick an arbitrary snippet from the page content — usually not ideal for CTR.',
        DESC_LIMIT
      ),
    [description]
  );

  const breadcrumb = useMemo(() => {
    const host = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const path = slug ? ` › search › ${slug}` : '';
    return `${host}${path}`;
  }, [siteUrl, slug]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: '#fff'
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Google search-result preview
      </Typography>

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: '#202124',
            display: 'block',
            fontSize: '12px',
            lineHeight: 1.4
          }}
        >
          {breadcrumb}
        </Typography>

        <Typography
          sx={{
            color: '#1a0dab',
            fontSize: '20px',
            lineHeight: 1.3,
            mt: 0.5,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {displayTitle}
        </Typography>

        <Typography
          sx={{
            color: '#4d5156',
            fontSize: '14px',
            lineHeight: 1.5,
            mt: 0.5
          }}
        >
          {displayDescription}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SerpPreview;
