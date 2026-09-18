import { Chip, Grid, Typography, styled } from '@mui/material';
import { dark } from 'config';
import { FC, Fragment } from 'react';

interface IProps {
  title: string;
  chips: Array<any>;
  handleClick: (selected: string | string[]) => void;
  selected: string | string[];
  error?: string;
  listKey?: string;
  isMultiSelect?: boolean;
  compareKey: string;
}

const StyledChip = styled(Chip)(() => ({
  padding: '20px 6px',
  fontSize: '12px',
  display: 'flex',
  borderRadius: '20px',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#F5F4F8',
  color: dark.darkBlue.main,
  '&[data-selectedstate="true"]': {
    background: dark.darkBlue.main,
    color: '#fff'
  },
  '@media (min-width: 768px)': {
    padding: '24px 15px',
    fontSize: '0.8125rem',
    '&&:hover': {
      backgroundColor: dark.darkBlue.main,
      color: '#fff'
    }
  }
}));

const SelectableChips: FC<IProps> = ({
  title,
  chips,
  handleClick,
  selected,
  error,
  isMultiSelect = false,
  listKey = 'title',
  compareKey
}) => {
  const toggleChip = (chip: any) => {
    const chipKeyValue = chip[compareKey];

    if (isMultiSelect) {
      const newSelected = (selected as any[])?.some((item) => item === chipKeyValue)
        ? (selected as any[]).filter((item) => item !== chipKeyValue)
        : [...(selected as any[]), chip[compareKey]];
      handleClick(newSelected);
    } else {
      handleClick(chipKeyValue);
    }
  };

  return (
    <Fragment>
      <Typography gutterBottom variant="h4" mt={2}>
        {title}&nbsp;&nbsp;
        <Typography component="span" variant="body1" color={dark.darkBlue.main}>
          {isMultiSelect && `( ${selected.length} ${title} Selected )`}
        </Typography>
      </Typography>
      <Grid container spacing={2}>
        {chips.map((chip, idx) => (
          <Grid item xs={6} md={3} key={chip[listKey] + idx}>
            <StyledChip
              icon={chip.icon && <img src={chip.icon} width={25} height={25} alt="" />}
              onClick={() => toggleChip(chip)}
              label={listKey ? chip[listKey] : chip}
              data-selectedstate={
                isMultiSelect ? (selected as any[])?.some((item) => item === chip[compareKey]) : selected === chip[compareKey]
              }
            />
          </Grid>
        ))}
      </Grid>
      {error && <Typography color="error">{error}</Typography>}
    </Fragment>
  );
};

export default SelectableChips;
