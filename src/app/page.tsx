import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Profile } from "@/components/home/Profile";
import { WorkIndex } from "@/components/home/WorkIndex";
import { Capabilities } from "@/components/home/Capabilities";
import { Metrics } from "@/components/home/Metrics";
import { Endnote } from "@/components/home/Endnote";

/**
 * Home — seven sections, folios (00) through (05) with the ticker unnumbered.
 *
 * A server component throughout: only `WorkIndex` and `Endnote` cross the
 * client boundary, and they do it in their own files.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Profile />
      <WorkIndex />
      <Capabilities />
      <Metrics />
      <Endnote />
    </>
  );
}
