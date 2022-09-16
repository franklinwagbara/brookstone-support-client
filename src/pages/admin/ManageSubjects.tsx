import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddSubject} from './components/subjects/AddSubject';
import {DeleteSubject} from './components/subjects/DeleteSubject';
import {EditSubject} from './components/subjects/EditSubject';
import {ViewSubjects} from './components/subjects/ViewSubjects';

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

export const ManageSubjects = (): JSX.Element => {
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
          View Subjects
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Subject
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Subject
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Subject
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewSubjects />}
        {show.add && <AddSubject />}
        {show.edit && <EditSubject />}
        {show.delete && <DeleteSubject />}
      </div>
    </div>
  );
};
