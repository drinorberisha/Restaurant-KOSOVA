import React from "react";
import { useRouter } from "next/router";
import styles from './MagazinaPage.module.css';
import Nav from "@/components/Navigation/nav";
import InventoryTable from "@/components/InventoryTable/InventoryTable";

const Magazina = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className={styles.background + " flex-grow"}>
        <div className={`${styles.matrix} relative w-full h-full my-[5%] mx-[5%]`}>
            <InventoryTable/>
        </div>
      </div>
    </div>
  );
};

export default Magazina;
