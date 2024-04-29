const DisplayIncognitoPopover = ({ checkedHandler, toggleHandler }) => {
    const ContentToDisplay = ({ isChecked, handleToggle }) => {
        return <div>
            <div className="incognito-rule-text">Faire un post incognito permet le non affichage de nom et d'image de l'utilisateur ayant fait le post, à l'exception des admins qui ont accèss a votre image et nom. <span className="incognito-pop-warning-text">Rassurez vous d'avoir coché le checkbox ci-dessous avant d'uploader votre post pour faire un post incognito!</span></div>
            <div className="incognito-input-container">
                <div className="incognito-input-field">
                    <input type="checkbox" name="first-check-box" id="first-check-box" checked={isChecked} onChange={(e) => handleToggle(e.target.checked)} className="form-check-input" />
                </div>
                <div className="incognito-check-labels-container">
                    <label htmlFor="first-check-box" className="incognito-form-check-label">Checkbox Post incognito</label>
                </div>
            </div>
        </div>
    }

    return <ContentToDisplay isChecked={checkedHandler} handleToggle={toggleHandler} />

}

export default DisplayIncognitoPopover;