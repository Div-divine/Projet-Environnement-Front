import RulesPopover from "../rules-popover/PopoverElem";
import ScaleItem from "../scale-items-with-motion/Framer-motion";
import { Link } from "react-router-dom";
import DisplayPopover from "../rules-popover/DisplayPopOver";
import likeIcon from '../../assets/svg/thumbs-up.svg';
import commentIcon from '../../assets/svg/comment-solid.svg';
import addIcon from '../../assets/svg/add-square.svg';

const DisplayRules = ({ isOpen, handleClose, groupData}) => {
    return (
        <>
            <RulesPopover isOpen={isOpen} onClose={handleClose}>
                <div className='popover-contents-container'>
                    <div className='group-image-container-in-popover'>
                        <div className='image-and-group-welcom-container'>
                            <div className='small-group-img-container'>
                                {groupData && <img src={`../../src/${groupData.group_img}`} alt="" className='group-img' />}
                            </div>
                            <div className='group-goal-text-container'>
                                <p>Bienvenue dans le group des militants et militantes de la nature!</p>
                            </div>
                            <div className='bigger-group-img-container'>
                                {groupData && <img src={`../../src/${groupData.group_img}`} alt="" className='group-img' />}
                            </div>
                        </div>
                    </div>
                    <div className='rules-container-in-popover'>
                        <div>
                            {groupData && <p className='rule-title-text'>Règles de notre group <span className='group-name-in-rules'>{groupData.group_name}</span></p>}
                        </div>
                        <div>
                            <p className='group-goal-text-container'>Ci-dessous sont les règles qui permettent le bon fonctionnement du group</p>
                        </div>
                        <DisplayPopover rules={<>
                            <div>- Les membres doivent respecter les opinions, les croyances et les perspectives des autres, même s'ils sont différents des leurs.</div>
                            <div className='mt-3'>- Les commentaires discriminatoires, haineux, offensants ou irrespectueux envers d'autres membres ne sont pas tolérés.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>1</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Respect et Tolérance' />
                            </div>
                        </>} />
                        <DisplayPopover rules={<>
                            <div>- Les membres doivent utiliser un langage approprié et respectueux dans leurs interactions avec les autres membres du groupe.</div>
                            <div className='mt-3'>- Les gros mots, les insultes ou toute autre forme de langage inapproprié ne sont pas autorisés.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>2</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Langage Approprié' />
                            </div>
                        </>} />
                        <DisplayPopover rules={<>
                            <div>- Les publications et les discussions doivent être en lien avec les thèmes environnementaux et les objectifs du groupe.</div>
                            <div className='mt-3'>- Les annonces publicitaires non pertinentes ou le spam ne sont pas autorisés.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>3</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Contenu Accepté' />
                            </div>
                        </>} />
                        <DisplayPopover rules={<>
                            <div>- Les membres sont encouragés à partager des informations provenant de sources fiables et vérifiées.</div>
                            <div className='mt-3'>- Les rumeurs, les fausses informations ou les théories du complot ne sont pas acceptées dans le groupe.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>4</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Sources Fiables' />
                            </div>
                        </>} />
                        <DisplayPopover rules={<>
                            <div>- Les membres doivent respecter la vie privée des autres membres en évitant de divulguer des informations personnelles sans autorisation.</div>
                            <div className='mt-3'>- La confidentialité des discussions privées doit être respectée.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>5</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Respect de la Vie Privée' />
                            </div>
                        </>} />
                        <DisplayPopover rules={<>
                            <div>- Les membres doivent respecter les droits d'auteur et ne pas partager de contenu protégé sans autorisation.</div>
                            <div className='mt-3'>- Les membres doivent obtenir la permission avant de partager du contenu créé par d'autres.</div>
                        </>} children={<>
                            <div
                                className='rules-text-and-number-container'>
                                <div className='number-container text-center'>6</div>
                                <ScaleItem hover={{ scale: 1.1 }} tap={{ scale: 0.9 }} classHandler='rules-text-container' children='Propriété Intellectuelle' />
                            </div>
                        </>} />
                        <div className='display-all-rules-btn-container'>
                            <input type="button" value="Tout afficher" />
                        </div>
                    </div>
                </div>
            </RulesPopover>
        </>
    )
}


export default DisplayRules;