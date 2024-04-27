import { motion } from "framer-motion"

const ScaleItem = ({hover, tap, classHandler, children}) => {
    return <motion.div
        whileHover={hover}
        whileTap={tap}
        className={classHandler} >
        {children}
    </motion.div>
}

export default ScaleItem;