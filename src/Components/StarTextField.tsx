import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import StarIcon from "@mui/icons-material/Star"

export default function StarTextField({ label, onChange }: TextFieldProps) {
    return <TextField label={label} type='number' onChange={onChange} InputProps={{
        endAdornment: (
            <InputAdornment position='end'>
                <StarIcon/>
            </InputAdornment>
        )
    }}/>
}