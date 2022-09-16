import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddStudent} from './components/students/AddStudent';
import {DeleteStudent} from './components/students/DeleteStudent';
import {EditStudent} from './components/students/EditStudent';
import {ViewStudents} from './components/students/ViewStudents';

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

export const ManageStudents = (): JSX.Element => {
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
          View Students
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Student
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Student
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Student
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewStudents />}
        {show.add && <AddStudent />}
        {show.edit && <EditStudent />}
        {show.delete && <DeleteStudent />}
      </div>
    </div>
  );
};
