import { useEffect, useState } from "react";
import { debounce } from "lodash";

import { LoadingSpinner } from "./LoadingSpinner";
import { Cross } from "~/assets/Cross";
import { Checkmark } from "~/assets/Checkmark";

export const NameFetchWizard = () => {
  const [services, setServices] = useState([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/services`)
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.error(err));
  }, []);

  const usernameOnChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e?.target?.value);
    },
    300
  );

  if (!services) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="min-h-4 hero rounded-xl bg-base-200 ">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">
                Find{" "}
                <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                  Your
                </span>{" "}
                Name
              </h1>
              <p className="py-6">
                Find your name on all the popular social media platforms. No
                more searching for hours to find the perfect username!
              </p>
              <input
                type="text"
                placeholder="Username..."
                onChange={usernameOnChange}
                className="input-bordered input w-full max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>
      {username && (
        <div className="grid grid-cols-1 gap-4 min-[510px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {services.map(({ service }) => (
            <NameFetchTile
              key={service}
              service={service}
              username={username}
            />
          ))}
        </div>
      )}
      {!username && (
        <div className="flex flex-col">
          <div className="hero min-h-fit bg-base-200 p-4">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold">
                  Find your username across multiple platforms!
                </h1>
                <p className="py-6">
                  No more searching for hours to find the perfect username! Just
                  plug it in here and {"we'll"} do the rest.
                </p>
              </div>
            </div>
          </div>
          <div className="hero min-h-fit bg-base-200 p-4">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold">
                  Based on InstantUsername!
                </h1>
                <p className="py-6">
                  This project is just a way for me to learn more about NextJs!
                  I had the idea while I was trying to find a username for
                  myself and thought it would be a fun project to work on. Then
                  I found{" "}
                  <a href="https://instantusername.com/">InstantUsername</a> had
                  already done a great job.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const loadingStatus = "Checking...";
const successStatus = "Available!";
const failureStatus = "Taken!";

const NameFetchTile = ({
  service,
  username,
}: {
  service: string;
  username: string;
}) => {
  const [isAvailable, setIsAvailable] = useState(loadingStatus);

  useEffect(() => {
    setIsAvailable(loadingStatus);

    if (!username) return;

    const controller = new AbortController();

    fetch(`/api/check/${service.toLowerCase()}/${username}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(({ available }) => {
        setIsAvailable(available ? successStatus : failureStatus);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") {
          console.log("Fetch cancelled");
        } else {
          console.error(err);
        }
      });

    // Clean up function
    return () => {
      controller.abort();
    };
  }, [username, service]);

  const availabilityColor = () => {
    switch (isAvailable) {
      case successStatus:
        return "border-success bg-success/50";
      case failureStatus:
        return "border-error bg-error/50";
      default:
        return "border-warning bg-warning/50";
    }
  };

  const availabilityIcon = () => {
    switch (isAvailable) {
      case successStatus:
        return <Checkmark />;
      case failureStatus:
        return <Cross />;
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <div className={`stats border-2 ${availabilityColor()} shadow`}>
      <div className="stat">
        <div className="stat-figure">{availabilityIcon()}</div>
        <div className="stat-title text-black">{service}</div>
        <div className="stat-desc text-black">{isAvailable}</div>
      </div>
    </div>
  );
};
