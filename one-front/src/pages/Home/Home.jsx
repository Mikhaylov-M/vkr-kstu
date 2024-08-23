import './Home.scss'
import { Hero } from './ui/Hero'
import { Calculator } from "./ui/Calculator";
import { Tracking } from './ui/Tracking';
import { Contact } from './ui/Contact';

export const Home = () => {
  return (
    <>
      <Hero />
      <Calculator />
      <Tracking />
      <Contact />
    </>
  )
}