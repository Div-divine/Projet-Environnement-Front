import '../../style/SingleGroupPage.css';
import SideBar from '../Menus/SideBarMenu';

const RenderSinglePostPage = () => {
    return <div className="group-page-container">
        <header>
            <nav>
                <SideBar />
            </nav>
        </header>
        <main className='group-main-elements'>
            <p>Single group</p>
        </main>
    </div>
}

export default RenderSinglePostPage;