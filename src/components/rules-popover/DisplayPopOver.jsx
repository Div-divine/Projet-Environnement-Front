import Popover from '../all-users-page/Popover';
import RulePopoverText from '../rules-popover/RulesTextsPopoverElem';

const DisplayPopover = ({rules, children}) =>{
    return <div>
        <Popover content={<RulePopoverText texts={rules}/>}>
            {children}
        </Popover>
    </div>

}

export default DisplayPopover;