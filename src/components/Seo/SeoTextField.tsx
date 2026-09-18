import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { FC } from 'react';

/**
 * SeoTextField — a Formik-wired text input with SEO guidance baked in.
 *
 * Differences from the plain InputField:
 *   - Real-time character counter (e.g. "47 / 60")
 *   - Colour-coded status based on `recommendedMin` / `recommendedMax`
 *       red    → below min OR above max (bad for SEO)
 *       orange → close to the edge (acceptable, not optimal)
 *       green  → inside the sweet spot
 *   - Optional `tip` helper text rendered under the field
 *
 * Why we need it:
 *   Google truncates meta titles around 60 characters and meta descriptions
 *   around 160. Content writers were updating slugs blind — this surfaces
 *   the limit live so titles never get cut off in SERPs.
 *
 * Usage:
 *   <SeoTextField
 *     name="slugMetaData.title"
 *     label="Meta Title"
 *     recommendedMin={50}
 *     recommendedMax={60}
 *     tip="Front-load the primary keyword. Example: Best British Schools in Dubai 2026-27 | Education Portal"
 *   />
 */

type SeoTextFieldProps = Omit<TextFieldProps, 'name'> & {
  name: string;
  recommendedMin?: number;
  recommendedMax?: number;
  tip?: string;
};

const SeoTextField: FC<SeoTextFieldProps> = ({
  name,
  recommendedMin = 0,
  recommendedMax = 0,
  tip,
  ...rest
}) => {
  const [field, meta] = useField(name);
  const form = useFormikContext();

  const raw: string = (field.value ?? '') as string;
  const length = raw.length;

  // Status thresholds — only meaningful when both min/max are set.
  let status: 'neutral' | 'good' | 'warn' | 'bad' = 'neutral';
  if (recommendedMax > 0) {
    if (length === 0) {
      status = 'neutral';
    } else if (length >= recommendedMin && length <= recommendedMax) {
      status = 'good';
    } else if (
      length > recommendedMax ||
      (recommendedMin > 0 && length < Math.max(1, recommendedMin - 10))
    ) {
      status = 'bad';
    } else {
      status = 'warn';
    }
  }

  const statusColor =
    status === 'good'
      ? '#2e7d32'
      : status === 'warn'
      ? '#ed6c02'
      : status === 'bad'
      ? '#d32f2f'
      : 'text.secondary';

  const counterLabel =
    recommendedMax > 0 ? `${length} / ${recommendedMax}` : `${length}`;

  return (
    <Box>
      <TextField
        {...rest}
        {...field}
        value={raw}
        onChange={(event) => {
          form.setFieldValue(field.name, event.target.value, false);
        }}
        fullWidth
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error ? (meta.error as string) : undefined}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mt: 0.5,
          gap: 1
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
          {tip}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: statusColor,
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}
        >
          {counterLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default SeoTextField;
