import { Typography } from '@mui/material'
import Card from './Components/Card'

export default function Footer() {
    return <Card nogradient sx={{ marginTop: '0px', top: 0, minHeight: '30px', display: 'flex', filter: 'brightness(0.75)', borderRadius: '0px' }}>
        <Typography fontSize='12.5px' marginTop='0.5em' marginBottom='0.5em' marginLeft='5px' textAlign='left'>
            Genshin Primo Tracker is not affiliated with or endorsed by miHoYo. © All rights reserved by miHoYo. Other properties belong to their respective owners.
        </Typography>
    </Card>
}