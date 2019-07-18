import s from './index.css';
import { getBgUrl, combineCss } from '@tools';

function profile(props) {
    const { userName, nickName, avatar } = props.info;
    return (
        <div className={s.meavatarbar}>
            <div className={s.meavatar} style={{ backgroundImage: getBgUrl(avatar) }} />
            <div className={s.wrapper}>
                <div className={s.nickname}>{nickName}</div>
                <div className={s.uid}>chatID: {userName}</div>
            </div>
        </div>
    )
}

export default profile;