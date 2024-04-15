import { Svg, Path } from "react-native-svg";

interface Props {
    fill?: string;
}

const RightIcon = ({fill}: Props) => (
    <Svg stroke={fill} viewBox="0 0 24 24" strokeWidth={1.5} fill="none">
    <Path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </Svg>

);

export default RightIcon;