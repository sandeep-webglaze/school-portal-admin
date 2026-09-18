import { CloseOutlined } from '@ant-design/icons';
import { Badge, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import 'assets/third-party/image-uploader.css';
import { FC, Fragment } from 'react';

interface ImageUploaderProps {
  selectedfile: any[];
  handleChangeFiles: (newFiles: any[]) => void;
  handleRemoveFIles: (url: string) => void;
}
const ImageUploader: FC<ImageUploaderProps> = ({ selectedfile, handleChangeFiles, handleRemoveFIles }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // const filesizes = (bytes: number, decimals = 2) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const dm = decimals < 0 ? 0 : decimals;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  // };

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImages = [];
    for (let index = 0; index < e.target.files?.length; index++) {
      newImages.push({ file: e.target.files.item(index) });
    }
    const images = [...selectedfile, ...newImages];
    handleChangeFiles(images);
  };

  const handleChangePublic = (checked: boolean, idx: number) => {
    const newImages = selectedfile;
    newImages[idx].isPublic = checked;
    handleChangeFiles(newImages);
  };

  const DeleteFile = async (idx: any, url?: string) => {
    if (window.confirm('Are you sure you want to delete this Image?')) {
      const result = selectedfile.filter((data: any, index: number) => index !== idx);
      handleChangeFiles(result);
      if (typeof url === 'string') handleRemoveFIles(url);
    } else {
      // alert('No');
    }
  };

  const showImage = (file: any) => {
    try {
      if (file instanceof File) {
        const imageUrl = URL.createObjectURL(file);
        return imageUrl;
      } else if (typeof file === 'string') {
        return file; // If 'file' is already an image URL
      }
    } catch (error) {
      console.error('Error creating object URL:', error);
    }
    return ''; // Return empty string if unable to create object URL
  };

  console.log('selectedfile=>', selectedfile);

  return (
    <div className="fileupload-view">
      <div className="row justify-content-center m-0">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title">
                    <h6>Add photos to your listing</h6>
                  </div>
                </div>
                <div className="kb-file-upload">
                  <div className="file-upload-box">
                    <input type="file" id="fileupload" className="file-upload-input" onChange={InputChange} multiple />
                    <span>
                      Drag and drop or <span className="file-link">Choose your files</span>
                    </span>
                  </div>
                </div>
                <ImageList cols={fullScreen ? 1 : 4} gap={10}>
                  {selectedfile.map((item: any, idx: number) => (
                    <Fragment key={idx}>
                      <Badge
                        onClick={() => DeleteFile(idx, item)}
                        sx={{ '& .MuiBadge-badge': { height: '22px', minWidth: 15 }, mt: 2, maxWidth: '200px', maxHeight: '200px' }}
                        badgeContent={<CloseOutlined style={{ fontSize: '15px' }} />}
                        color="error"
                      >
                        <ImageListItem>
                          <img
                            src={item.file ? showImage(item.file) : item}
                            alt={'item.'}
                            style={{ marginBottom: '20px', borderRadius: '15px', maxWidth: '200px', maxHeight: '200px' }}
                            loading="lazy"
                          />
                        </ImageListItem>
                      </Badge>
                    </Fragment>
                  ))}
                </ImageList>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
