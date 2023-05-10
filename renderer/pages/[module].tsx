import { useRouter } from "next/router";
import Loading from '../components/Loading';
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
    setCurrentModule(current);
    return () => { };
  }, [router.query, modules]);

  if (currentModule) {
    const Renderer = dynamic(
      () => import(`@lib/modules/${currentModule.renderer}/renderer`),
      {
        loading: () => <Loading />,
      }
    );

    return <Renderer modules={modules} />;
  }
  return <p>No module found for: {module}</p>;
};

export default Module;
