"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { projects } from "@/lib/site-data";

const filters = [
  ["all", "All work"],
  ["home", "Residential"],
  ["farm", "Agricultural"],
  ["commercial", "Commercial"],
  ["custom", "Architectural"],
  ["process", "Behind the build"],
] as const;

export function ProjectGallery({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => {
    const matching =
      filter === "all"
        ? [...projects]
        : projects.filter((project) => project.type === filter);
    return typeof limit === "number" ? matching.slice(0, limit) : matching;
  }, [filter, limit]);
  const project = active === null ? null : visible[active];

  const move = (direction: number) =>
    setActive((current) =>
      current === null
        ? 0
        : (current + direction + visible.length) % visible.length,
    );

  return (
    <>
      {!limit ? (
        <div className="gallery-filters" aria-label="Filter projects">
          {filters.map(([id, label]) => (
            <button
              className={filter === id ? "active" : ""}
              key={id}
              type="button"
              onClick={() => {
                setFilter(id);
                setActive(null);
              }}
            >
              {label}
              <span>
                {id === "all"
                  ? projects.length
                  : projects.filter((item) => item.type === id).length}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <div className={`portfolio-grid ${limit ? "portfolio-preview" : ""}`}>
        {visible.map((item, index) => (
          <button
            className="portfolio-card"
            type="button"
            onClick={() => setActive(index)}
            key={item.image}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            <span className="portfolio-shade" />
            <span className="portfolio-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="portfolio-copy">
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              <i>
                View project <ArrowRight />
              </i>
            </span>
          </button>
        ))}
      </div>
      {project ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          onClick={() => setActive(null)}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X />
          </button>
          <button
            className="lightbox-arrow previous"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="Previous"
          >
            <ArrowLeft />
          </button>
          <div
            className="lightbox-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lightbox-image">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="90vw"
              />
            </div>
            <div className="lightbox-caption">
              <span>
                {project.category} ·{" "}
                {String((active ?? 0) + 1).padStart(2, "0")}/
                {String(visible.length).padStart(2, "0")}
              </span>
              <h2>{project.title}</h2>
              <p>
                A real Shed Shop project—designed around its site, intended use
                and the people who rely on it.
              </p>
            </div>
          </div>
          <button
            className="lightbox-arrow next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="Next"
          >
            <ArrowRight />
          </button>
        </div>
      ) : null}
    </>
  );
}
