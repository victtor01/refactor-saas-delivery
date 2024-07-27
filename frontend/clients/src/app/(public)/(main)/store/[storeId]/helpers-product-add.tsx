import { motion } from "framer-motion";

export const Background = ({ children }: { children: React.ReactNode }) => (
  <motion.div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-40 z-50 overflow-hidden flex items-end justify-center backdrop-blur-sm">
    {children}
  </motion.div>
);

export const Container = ({ children }: { children: React.ReactNode }) => (
  <Background>
    <motion.div
      className="w-full max-w-[45rem] bg-white mx-auto rounded-t-2xl h-[90%] relative overflow-hidden flex flex-col"
      transition={{ type: "linear" }}
      initial={{ y: 1000 }}
      animate={{ y: 0 }}
      exit={{ y: 1000 }}
    >
      {children}
    </motion.div>
  </Background>
);
