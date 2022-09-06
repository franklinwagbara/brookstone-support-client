import {ReactNode} from 'react';
import './style.css';
import {Card} from '../components';
import {NavItems} from '../components/Header';
import {SideNavItem} from '../pages/Dashboard';
import {Button} from '@mui/material';

interface Props {}
export const Assessment = () => {
  const arr = Array.from([1, 2, 3, 4, 5, 5, 6, 7]);
  return (
    <div id="main" className="px-6 py-8">
      <div id="basic_info" className="basic_info">
        <h3>Class:</h3>
        <h3>Subject: </h3>
        <h3>Teacher: </h3>
      </div>
      <form>
        <table className="table-auto border-separate p-3 border border-slate-400 w-full">
          <thead>
            <tr className=" bg-gray-200">
              <th className="px-5 py-2 border border-slate-300">S/N</th>
              <th className="px-5 py-2 border border-slate-300">
                Student Name
              </th>
              <th className="px-5 py-2 border border-slate-300">Gender</th>
              <th className="px-5 py-2 border border-slate-300">Week 1</th>
              <th className="px-5 py-2 border border-slate-300">Week 2</th>
              <th className="px-5 py-2 border border-slate-300">Week 3</th>
              <th className="px-5 py-2 border border-slate-300">Week 4</th>
              <th className="px-5 py-2 border border-slate-300">Half Term</th>
              <th className="px-5 py-2 border border-slate-300">CCM</th>
              <th className="px-5 py-2 border border-slate-300">Week 5</th>
            </tr>
          </thead>
          <tbody>
            {arr.map((el, index) => (
              <tr key={index} className="">
                <td className="py-2 text-center border border-slate-300">
                  {index + 1}
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin Wagbara
                </td>
                <td className="py-2 text-center border border-slate-300">M</td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
                <td className="py-2 text-center border border-slate-300">
                  Franklin
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button sx={{marginTop: 1}} variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};
