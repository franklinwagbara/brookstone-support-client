import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddBoardingEnrollment} from './components/boardingEnrollments/AddBoardingEnrollment';
import {DeleteBoardingEnrollment} from './components/boardingEnrollments/DeleteBoardingEnrollment';
import {EditBoardingEnrollment} from './components/boardingEnrollments/EditBoardingEnrollment';
import {ViewBoardingEnrollments} from './components/boardingEnrollments/ViewBoardingEnrollments';

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

export const ManageBoardingEnrollments = (): JSX.Element => {
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
          View Boarding Enrollments
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Boarding Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Boarding Enrollment
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Boarding Enrollment
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewBoardingEnrollments />}
        {show.add && <AddBoardingEnrollment />}
        {show.edit && <EditBoardingEnrollment />}
        {show.delete && <DeleteBoardingEnrollment />}
      </div>
    </div>
  );
};
