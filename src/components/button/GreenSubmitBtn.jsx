import '../../style/BtnsStyle.css';

const GreenSbmtBtn = ({value}) => {
    return <>
    <div className='grn-btn-container'>
        <input type="submit" value={value} className='green-btn'/>
    </div>
    </>
}

export default GreenSbmtBtn