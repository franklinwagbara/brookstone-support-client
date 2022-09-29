import {Modal, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';
import {IBehaviour, IBoardingEnrollment} from '../interfaces';
import {InputSelect} from './InputSelect';
import {AlertType, WEEKS} from '../globals/constants';
import {WEEKS_MAPPER, RATINGS} from '../globals/constants';
import {
  IBehaviourRequest,
  useAddBehaviourMutation,
  useFetchBehavioursQuery,
  useUpdateBehaviourMutation,
} from '../features/behaviour/behaviour_api_slice';
import {useAppDispatch} from '../app/hooks';
import {setAlert} from '../features/alert/alert-slice';

interface IEditProps {
  open: boolean;
  enrollment: IBoardingEnrollment;
  onSubmit: (boardingHouseInfo: IBoardingEnrollment) => void;
  onClose: () => void;
}

const initialBehaviour = {
  _id: '' as any,
  student: '' as any,
  session: '' as any,
  week: '' as any,
  active_participation_and_composure_during_lessons: '' as any,
  ownership_of_learning: '' as any,
  punctuality_and_attendance_to_lessons: '' as any,
  motivation_and_value_for_academic_success: '' as any,
  self_confidence_towards_academic_work: '' as any,
  effective_use_of_study_skills: '' as any,
  Assessed_extended_learning: '' as any,
  completion_of_extended_learning: '' as any,
  organizational_skills: '' as any,
  obedience_to_pastoral_rules_and_regulations: '' as any,
  cooperation_with_boarding_parents: '' as any,
  cooperation_with_support_teachers: '' as any,
  ability_to_concentrate_during_prep: '' as any,
  punctuality: '' as any,
} as IBehaviour;

export const EditBoardingHouseModal = ({
  open: openModal,
  enrollment,
  onSubmit,
  onClose,
}: IEditProps) => {
  const [boardingHouseInfo, setBoardingHouseInfo] =
    useState<IBoardingEnrollment>({
      ...enrollment,
    });
  const [week, setWeek] = useState<string>('1');
  const [behaviour, setBehaviour] = useState<IBehaviour>(initialBehaviour);

  const dispatch = useAppDispatch();

  const {
    data: fetchedBehaviours,
    isLoading: isLoadingBehaviours,
    isSuccess: isSuccessBehavioours,
  } = useFetchBehavioursQuery(
    {
      student: enrollment.student._id as any,
      session: enrollment.session._id as any,
    },
    {skip: !enrollment.student._id}
  );

  const [addBehaviour, {isLoading: isLoadingAddBehaviour}] =
    useAddBehaviourMutation();
  const [updateBehaviour, {isLoading: isLoadingUpdateBehaviour}] =
    useUpdateBehaviourMutation();

  useEffect(() => {
    if (
      fetchedBehaviours?.data &&
      (fetchedBehaviours.data as IBehaviour[]).length > 0
    ) {
      let _behaviour = (fetchedBehaviours.data as IBehaviour[]).find(
        b => b.week === week
      );

      if (!_behaviour) {
        setBehaviour(initialBehaviour);
        return;
      }

      const tempBe = {...initialBehaviour};

      tempBe._id = _behaviour._id as any;
      tempBe.student = _behaviour.student._id as any;
      tempBe.session = _behaviour.session._id as any;
      tempBe.week = _behaviour.week as any;
      tempBe.completion_of_extended_learning =
        (_behaviour.completion_of_extended_learning as any) || ('' as any);
      tempBe.organizational_skills =
        (_behaviour.organizational_skills as any) || ('' as any);
      tempBe.obedience_to_pastoral_rules_and_regulations =
        (_behaviour.obedience_to_pastoral_rules_and_regulations as any) ||
        ('' as any);
      tempBe.cooperation_with_support_teachers =
        (_behaviour.cooperation_with_support_teachers as any) || ('' as any);
      tempBe.cooperation_with_boarding_parents =
        (_behaviour.cooperation_with_boarding_parents as any) || ('' as any);
      tempBe.ability_to_concentrate_during_prep =
        (_behaviour.ability_to_concentrate_during_prep as any) || ('' as any);
      tempBe.punctuality = (_behaviour.punctuality as any) || ('' as any);
      setBehaviour(tempBe);
    } else {
      setBehaviour({...initialBehaviour});
    }

    if (enrollment) {
      setBoardingHouseInfo({...enrollment});
    }
  }, [fetchedBehaviours, enrollment, week]);

  const handleSubmit = async () => {
    onSubmit(boardingHouseInfo);
    if (behaviour.student && behaviour.session) {
      const _tempBe = {
        ...behaviour,
        week: week,
      };
      await updateBehaviour(behaviour as any)
        .unwrap()
        .catch(error => {
          dispatch(
            setAlert({
              message:
                'Something went wrong while trying to save Behaviour assessment!',
              show: true,
              type: AlertType.ERROR,
            })
          );
        });
    } else {
      const _tempBe = {
        ...behaviour,
        student: enrollment.student._id as any,
        session: enrollment.session._id as any,
        week: week,
      };
      await addBehaviour(_tempBe as any)
        .unwrap()
        .catch(error => {
          dispatch(
            setAlert({
              message:
                'Something went wrong while trying to save Behaviour assessment!',
              show: true,
              type: AlertType.ERROR,
            })
          );
        });
    }
    onClose();
  };

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className=" max-h-screen overflow-auto flex flex-col flex-1 gap-4 m-auto w-150 p-4 bg-background ">
        <InputSelect
          label="Week"
          value={week}
          onChange={e => setWeek(e.target.value as string)}
          selectionList={WEEKS}
        />

        <TextField
          value={
            boardingHouseInfo[WEEKS_MAPPER[week] as unknown as string] || ''
          }
          label="Form Tutor's Comment"
          multiline
          minRows={5}
          onChange={e =>
            setBoardingHouseInfo({
              ...boardingHouseInfo,
              [WEEKS_MAPPER[week]]: e.target.value as string,
            })
          }
        />

        <table className="border-separate">
          <caption className=" font-extrabold py-3">
            Behavioural Assessment
          </caption>
          <thead>
            <tr>
              <th></th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Completion of extended learning
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.completion_of_extended_learning}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      completion_of_extended_learning: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">Organizational skills </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.organizational_skills}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      organizational_skills: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Obedience to pastoral rules and regulations
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.obedience_to_pastoral_rules_and_regulations}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      obedience_to_pastoral_rules_and_regulations: e.target
                        .value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Cooperation with boarding Parents
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.cooperation_with_boarding_parents}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      cooperation_with_boarding_parents: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Ability to concentrate during prep
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.ability_to_concentrate_during_prep}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      ability_to_concentrate_during_prep: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">Punctuality</td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.punctuality}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      punctuality: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
