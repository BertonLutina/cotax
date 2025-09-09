import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function FlagLoader({ flagSrc, showLoader }) {
 


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <motion.img
      src={flagSrc || require("../../assets/flag.png")}
      alt="Flag"
      className="h-32 w-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }} // fade in then fade out
      transition={{
        duration: 2,  // total time for one cycle
        repeat: Infinity, // loop forever
        ease: "easeInOut",
      }}
    />
  </div>
  );
}
