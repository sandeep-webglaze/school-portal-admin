import React, { Fragment, useEffect, useState } from 'react';
// import { RiDragMove2Line } from 'react-icons/ri';
// import './App.css';
import { Button } from '@mui/material';
import { ISchool, setFeaturedSchoolPriority } from 'api/school';
import { ErrorResponseSchema } from 'api/types';
import { Snack } from 'contexts/SnackBarContext';
import useSnackBarContext from 'hooks/useSnackBar';
import '../assets/third-party/drag.css';

interface DragableSchoolsProps {
  schools?: ISchool[];
}

const DragableSchools: React.FC<DragableSchoolsProps> = ({ schools }) => {
  const [items, setItems] = useState<ISchool[]>([...(schools ?? [])]);
  const { setSnack } = useSnackBarContext();
  const [draggingItem, setDraggingItem] = useState<ISchool | null>(null);

  useEffect(() => {
    setItems([...(schools ?? [])]);
  }, [schools]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ISchool) => {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: ISchool) => {
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updatedItems = [...items];
      updatedItems.splice(currentIndex, 1);
      updatedItems.splice(targetIndex, 0, draggingItem);
      setItems(updatedItems);
    }
  };

  return (
    <Fragment>
      <Button variant="contained" size="large" sx={{ float: 'right' }} onClick={handleOrderChange}>
        Save Changes
      </Button>
      <div className="sortable-list">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`item ${item === draggingItem ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item)}
          >
            <div className="details">
              <img src={item.images[0]} alt={item.name} />
              <span>{item.name}</span>
            </div>
            <div className="max-w-sm">
              <p>{item.classification.name}</p>
            </div>
            <div className="max-w-sm">
              <p>{item.type.map((type) => type.name)}</p>
            </div>
            <div className="max-w-sm">
              <p>{item.schoolBoards.map((type) => type.name)}</p>
            </div>

            {/* <RiDragMove2Line /> */}
          </div>
        ))}
      </div>
    </Fragment>
  );

  function handleOrderChange() {
    const body = { priorities: items.map((item, idx) => ({ schoolId: item._id, priority: idx + 1 })) };
    setFeaturedSchoolPriority(body)
      .then((res) => {
        if (res.data) {
          setSnack(new Snack({ color: 'success', message: 'Changes Done Succussfully', open: true }));
        }
      })
      .catch((err: ErrorResponseSchema) => {
        setSnack(new Snack({ color: 'error', message: err.error?.displayMessage ?? 'Something Went Wrong!', open: true }));
      });
  }
};

export default DragableSchools;
