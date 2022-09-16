import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface SelectProps {
  label: string;
  value: any;
  onChange: (e: SelectChangeEvent<any>) => void;
  selectionList: string[];
  size?: 'small' | 'medium' | undefined;
}

export const InputSelect = ({
  label,
  value,
  onChange,
  selectionList,
  size,
}: SelectProps): JSX.Element => {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={value}
        label={label}
        onChange={onChange}
        size={size}
      >
        {selectionList &&
          selectionList.map(item => <MenuItem value={item}>{item}</MenuItem>)}
      </Select>
    </FormControl>
  );
};
