import { Typography } from '@mui/material'
import Card from './Components/Card'

export default function Header() {
    return <Card nogradient sx={{ marginTop: '0px', top: 0, height: '45px', justifyContent: 'center', alignItems: 'center', borderRadius: '0px', display: 'flex' }}>
        <Typography fontSize='25px' textAlign='center'>
            Genshin Primo Tracker
        </Typography>
    </Card>
}