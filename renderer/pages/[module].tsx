import { useRouter } from "next/router";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { useModules, Module as ModuleInterface } from "../hooks/modules";
import dynamic from "next/dynamic";
import { Typography } from "@mui/material";
import re from "../../lib/modules/settings/renderer";

const Module = () => {
  const [currentModule, setCurrentModule] = useState<ModuleInterface>();
  const router = useRouter();
  const { module } = router.query;
  const { modules } = useModules();

  useEffect(() => {
    const current = modules.find((mod) => mod.url === `/${module}`);
    setCurrentModule(current);
    return () => {};
  }, [router.query, modules]);
  console.log("modules", modules);
  console.log("currentModule", currentModule);
  if (currentModule) {
    const Renderer = dynamic(
      () =>
        import(`../../lib/modules/${currentModule.renderer}/renderer`).catch(
          (err) => console.log
        ),
      {
        loading: () => (
          <>
            <Typography variant="h3"> Loading modules... </Typography>{" "}
            <Loading />
          </>
        ),
      }
    );
    console.log("router", router);
    return (
      <>
        <Typography variant="h1">{router.asPath}</Typography>
        <Renderer modules={modules} />
      </>
    );
  }
  return <p>No module found for: {module}</p>;
};

export default Module;
