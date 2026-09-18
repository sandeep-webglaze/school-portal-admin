import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Box, IconButton, Tooltip } from '@mui/material';
import { USER_ROLE } from 'constants/enums';
import useUserContext from 'hooks/useUser';
import { FC } from 'react';
import { useLocation } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';

interface ActionProps {
  handleDelete?: Function;
  handleView?: Function;
  handleEdit?: Function;
  isDelete?: boolean;
  isView?: boolean;
  isEdit?: boolean;
}

const ActionsTool: FC<ActionProps> = ({
  isView = false,
  isEdit = true,
  handleDelete = () => {},
  handleView = () => {},
  handleEdit = () => {},
  isDelete = false
}) => {
  const { pathname } = useLocation();
  const { user } = useUserContext();
  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      {isView && (
        <Tooltip title="View" onClick={() => handleView()}>
          <IconButton color="secondary">
            <EyeOutlined />
          </IconButton>
        </Tooltip>
      )}
      {isEdit && (
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={() => handleEdit()}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      )}
      {isDelete && (user?.role === USER_ROLE.ADMIN || pathname === ROUTES.SCHOOL.SCHOOL_LIST) && (
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDelete()}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ActionsTool;
