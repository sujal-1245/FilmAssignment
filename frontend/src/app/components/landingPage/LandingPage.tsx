import React from 'react'
import Navbar from './Navbar'
import CardCarouselParent from './CardCarouselParent'
import FlipLink from '@/components/ui/text-effect-flipper'
import WrapButton from '@/components/ui/wrap-button'
import { FileVideoCamera, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import { Playfair_Display } from "next/font/google";
import { Table } from '@/components/ui/table'

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"], // black weight = theatrical
});



const LandingPage = () => {
  return (
    <div >
      {/* Navbar entrance */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10"
      >
        <Navbar />
      </motion.div>


      <div id='hero' className="relative w-full pt-25 mb-40">

        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 -z-10 mt-75"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <CardCarouselParent />
        </motion.div>

        {/* Foreground Content */}
        <motion.div
          className="text-center w-full py-10 my-10 relative z-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.25 }
            }
          }}
        >

          {/* FlipLink 1 */}
          <motion.div
            className={playfair.className}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              textTransform: "uppercase",
              fontWeight: 900,
              letterSpacing: "0.12em",
              fontSize: "clamp(2rem, 8vw, 5rem)", // ✅ responsive magic: scales between 2rem (mobile) and 5rem (desktop)
              lineHeight: "1",
              wordBreak: "break-word",
              textAlign: "center",
            }}
          >
            <FlipLink href="https://www.netflix.com/in/">Film</FlipLink>
          </motion.div>

          <motion.div
            className={playfair.className}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              textTransform: "uppercase",
              fontWeight: 900,
              letterSpacing: "0.12em",
              fontSize: "clamp(2rem, 8vw, 5rem)", // ✅ same responsiveness
              lineHeight: "1",
              wordBreak: "break-word",
              textAlign: "center",
            }}
          >
            <FlipLink href="https://www.netflix.com/in/">Appreciation</FlipLink>
          </motion.div>





          {/* Button Animation */}
          <motion.div
            className="w-full flex justify-center"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <WrapButton className="mt-10" href="#submission">
              <FileVideoCamera />
              Submit Assignment
            </WrapButton>
          </motion.div>

        </motion.div>


      </div>

    </div>
  )
}

export default LandingPage
