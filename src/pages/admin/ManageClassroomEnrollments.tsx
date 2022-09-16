import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddClassroomEnrollment} from './components/classroomEnrollments/AddClassroomEnrollment';
import {DeleteClassroomEnrollment} from './components/classroomEnrollments/DeleteClassroomEnrollment';
import {EditClassroomEnrollment} from './components/classroomEnrollments/EditClassroomEnrollment';
import {ViewClassroomEnrollments} from './components/classroomEnrollments/ViewClassroomEnrollments';

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

export const ManageClassroomEnrollments = (): JSX.Element => {
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
          View Classroom Enrollments
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Classroom Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Classroom Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Classroom Enrollment
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewClassroomEnrollments />}
        {show.add && <AddClassroomEnrollment />}
        {show.edit && <EditClassroomEnrollment />}
        {show.delete && <DeleteClassroomEnrollment />}
      </div>
    </div>
  );
};
