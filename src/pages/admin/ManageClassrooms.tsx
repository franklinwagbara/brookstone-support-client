import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddClassroom} from './components/classrooms/AddClassroom';
import {DeleteClassroom} from './components/classrooms/DeleteClassroom';
import {EditClassroom} from './components/classrooms/EditClassroom';
import {ViewClassrooms} from './components/classrooms/ViewClassrooms';

interface IShowState {
  [key: string]: boolean;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

const initialShowState: IShowState = {
  view: false,
  add: false,
  edit: false,
  delete: false,
};

export const ManageClassrooms = (): JSX.Element => {
  const [show, setShow] = useState({...initialShowState});

  const handleNavClick = (path: string) => {
    const showState = {...initialShowState};
    showState[path as any] = true;
    setShow(showState);
  };

  return (
    <div>
      <InnerNavBar>
        <InnerNavBarItem
          onClick={() => handleNavClick('view')}
          active={show.view}
        >
          View Classroooms
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Classroom
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Classroom
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Classroom
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewClassrooms />}
        {show.add && <AddClassroom />}
        {show.edit && <EditClassroom />}
        {show.delete && <DeleteClassroom />}
      </div>
    </div>
  );
};
