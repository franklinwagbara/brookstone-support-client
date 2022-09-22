import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddYearGroup} from './components/yearGroup/AddYearGroup';
import {DeleteYearGroup} from './components/yearGroup/DeleteYearGroup';
import {EditYearGroup} from './components/yearGroup/EditYearGroup';
import {ViewYearGroups} from './components/yearGroup/ViewYearGroups';

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

export const ManageYearGroups = (): JSX.Element => {
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
          View YearGroups
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add YearGroup
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit YearGroup
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete YearGroup
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewYearGroups />}
        {show.add && <AddYearGroup />}
        {show.edit && <EditYearGroup />}
        {show.delete && <DeleteYearGroup />}
      </div>
    </div>
  );
};
