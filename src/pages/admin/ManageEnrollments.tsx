import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddEnrollment} from './components/enrollments/AddEnrollment';
import {DeleteEnrollment} from './components/enrollments/DeleteEnrollment';
import {EditEnrollment} from './components/enrollments/EditEnrollment';
import {ViewEnrollments} from './components/enrollments/ViewEnrollments';

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

export const ManageEnrollments = (): JSX.Element => {
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
          View Enrollments
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Enrollment
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewEnrollments />}
        {show.add && <AddEnrollment />}
        {show.edit && <EditEnrollment />}
        {show.delete && <DeleteEnrollment />}
      </div>
    </div>
  );
};
