import {useState} from 'react';
import {InnerNavBar, InnerNavBarItem} from '../../components';
import {AddBoardingHouse} from './components/boardingHouses/AddBoardingHouse';
import {DeleteBoardingHouse} from './components/boardingHouses/DeleteBoardingHouse';
import {EditBoardingHouse} from './components/boardingHouses/EditBoardingHouse';
import {ViewBoardingHouses} from './components/boardingHouses/ViewBoardingHouses';

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

export const ManageBoardingHouses = (): JSX.Element => {
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
          View Boarding House
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('add')}
          active={show.add}
        >
          Add Boarding House
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('edit')}
          active={show.edit}
        >
          Edit Boarding House
        </InnerNavBarItem>
        <InnerNavBarItem
          onClick={() => handleNavClick('delete')}
          active={show.delete}
        >
          Delete Boarding House
        </InnerNavBarItem>
      </InnerNavBar>
      <div id="content_area">
        {show.view && <ViewBoardingHouses />}
        {show.add && <AddBoardingHouse />}
        {show.edit && <EditBoardingHouse />}
        {show.delete && <DeleteBoardingHouse />}
      </div>
    </div>
  );
};
