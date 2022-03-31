import PrimogemSrc from "../Assets/Item_Primogem.png";
import { styled } from "@mui/material"

interface PrimogemProps {
    size?: number;
}

const PrimogemImg = styled("img")<PrimogemProps>(({ size = 1 }) => ({
    width: "auto",
    height: `${size * 1.5}em`,
    verticalAlign: 'bottom'
}))

export default function Primogem() {
    return <PrimogemImg src={PrimogemSrc}/>
}