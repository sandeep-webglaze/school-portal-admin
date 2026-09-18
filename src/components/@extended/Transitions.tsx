import { ReactNode, forwardRef } from 'react';

// material-ui
import { Fade, Box, Grow } from '@mui/material';

// ==============================|| TRANSITIONS ||============================== //

interface PropsType {
  type?: string;
  position?: string;
  children: ReactNode;
}

const Transitions = forwardRef(({ children, position = 'top-left', type = 'grow', ...others }: PropsType, ref) => {
  let positionSX = {
    transformOrigin: '0 0 0'
  };

  switch (position) {
    case 'top-right':
    case 'top':
    case 'bottom-left':
    case 'bottom-right':
    case 'bottom':
    case 'top-left':
    default:
      positionSX = {
        transformOrigin: '0 0 0'
      };
      break;
  }

  return (
    <Box ref={ref}>
      {type === 'grow' && (
        <Grow {...others}>
          <Box sx={positionSX}>{children}</Box>
        </Grow>
      )}
      {type === 'fade' && (
        <Fade
          {...others}
          timeout={{
            appear: 0,
            enter: 300,
            exit: 150
          }}
        >
          <Box sx={positionSX}>{children}</Box>
        </Fade>
      )}
    </Box>
  );
});

export default Transitions;
