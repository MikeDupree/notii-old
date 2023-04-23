import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useModules, Module as ModuleInterface } from "../hooks/modules";
import dynamic from "next/dynamic";

const Module = () => {
  const [currentModule, setCurrentModule] = useState<ModuleInterface>();
  const router = useRouter();
  const { module } = router.query;
  const { modules } = useModules();

  useEffect(() => {
    const current = modules.find((mod) => mod.url === `/${module}`);
    console.log("current", current);
    setCurrentModule(current);
    return () => { };
  }, [router.query, modules]);
  console.log("useModules", modules);

  if (currentModule) {
    const Renderer = dynamic(
      () => import(`@lib/modules/${currentModule.renderer}/renderer`),
      {
        loading: () => <p>Loading...</p>,
      }
    );

    return <Renderer />;
  }
  return <p>Module: {module}</p>;
};

export default Module;
