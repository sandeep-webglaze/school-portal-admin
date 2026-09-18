import { CameraFilled } from '@ant-design/icons';
import { Avatar, Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserImg from 'assets/images/users/userAvatar.png';
//This button is needed so "component='label'" can be set for the styled component ImageButton.
//This way the whole overlay works as an input and is clickable.

const ImageInputButton = (props: ButtonProps<'label'>) => {
  return <Button {...props} component="label" />;
};

//start of styling for logo and overlay
const ImageButton = styled(ImageInputButton)(({ theme }) => ({
  position: 'relative',
  height: 150,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.4
    },
    '& .MuiImageMarked-container': {
      visibility: 'visible'
    },
    '& .MuiImageMarked-root': {
      opacity: 0.8
    }
  }
}));

//styling for image/logo/profilepicture
const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
});

//styling for opacity effect
const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0,
  transition: theme.transitions.create('opacity')
}));

//styling for overlay logo (here the cameraIcon)
const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opactiy: 0,
  visibility: 'hidden',
  color: theme.palette.common.white
}));
//end of styling
interface UserAvatarProps {
  selectedImage?: File | null | undefined | string;
  imageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function UserAvatar({ selectedImage = null, imageChange = () => {} }: UserAvatarProps) {
  const isFile = (input: any) => 'File' in window && input instanceof File;
  return (
    <Avatar
      sx={{
        height: 80,
        width: 80,
        backgroundColor: 'transparent'
      }}
    >
      <ImageButton
        focusRipple
        key={'random'}
        style={{
          width: '100%'
        }}
      >
        <ImageSrc
          style={{
            backgroundImage: `url(${
              selectedImage ? (isFile(selectedImage) ? URL.createObjectURL(selectedImage as any) : selectedImage) : UserImg
            })`,
            backgroundSize: 'contain'
          }}
        />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image className="MuiImageMarked-container">
          <CameraFilled className="MuiImageMarked-root" color="white" style={{ fontSize: '30px' }} />
        </Image>
        <input type="file" accept="image/*" multiple hidden onChange={(e) => imageChange(e)} />
      </ImageButton>
    </Avatar>
  );
}
