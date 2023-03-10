import fetchCoffeStoresData from "@/lib/coffe-stores";
import { StoreContext } from "@/store/store-context";
import { isEmpty } from "@/utils";
import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/coffee-store.module.css";

export async function getStaticProps(staticProps) {
  const datas = await fetchCoffeStoresData();
  const params = staticProps.params;
  const findCoffeStore = datas.find(
    (coffeStore) => coffeStore.fsq_id.toString() === params.id
  );
  return {
    props: {
      coffeStore: findCoffeStore ? findCoffeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const datas = await fetchCoffeStoresData();
  const paths = datas.map((coffeStore) => {
    return {
      params: {
        id: coffeStore.fsq_id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {});

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
        handleCoffeStores(findCoffeeStoreById);
      }
    } else {
      // SSG
      // handleCoffeStores(initialProps.coffeeStore);
    }

    //eslint-disable-next-line
  }, [id]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleCoffeStores = async () => {
    try {
      const { id, name, voting, imgUrl, country, address } = coffeeStore;
      const response = await fetch("/api/createCoffeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          country: country || "",
          address: address || "",
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error("Error creating coffee store", err);
    }
  };

  const {
    name,
    location: { address, country },
    imgUrl,
    votingCount,
  } = props.coffeStore;

  const handleUpvoteButton = () => {
    console.log("Voting");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">??? Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {country && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{country}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
