import React from "react";
import type { SearchResult } from "../types";

interface Props {
  item: SearchResult;
  onClose: () => void;
}

export default function ResultModal({ item, onClose }: Props) {
  const desc =
    item.extra_infos?.find((e: any) => e.key === "description")?.value || "not provided";
  const facilitiesEntries =
    item.facilities && Object.keys(item.facilities).length > 0
      ? Object.entries(item.facilities)
      : null;
  const state = item.location_obj?.state?.[0] ?? "not provided";
  const street = item.location_obj?.street?.[0] ?? item.locations?.[0]?.street ?? "not provided";
  const photos: string[] = item.photos && item.photos.length
    ? item.photos.map((p: string) => (p.startsWith("http") ? p : `https://images.hotels.ng/${p}`))
    : [];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        <h2 className="modal__title">{item.business_name ?? "not provided"}</h2>

        <div className="modal__section">
          <strong>Description</strong>
          <div
            className="modal__description"
            dangerouslySetInnerHTML={{ __html: desc === "not provided" ? "<p>not provided</p>" : desc }}
          />
        </div>

        <div className="modal__section">
          <strong>Facilities</strong>
          {facilitiesEntries ? (
            <div style={{ overflowX: "auto" }}>
              <table className="modal__facilities-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {facilitiesEntries.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>not provided</div>
          )}
        </div>

        <div className="modal__section">
          <strong>Location</strong>
          <div>State: {state}</div>
          <div>Street: {street}</div>
        </div>

        <div className="modal__section">
          <strong>Images</strong>
          {photos.length ? (
            <div className="modal__gallery">
              {photos.map((src, i) => (
                <img key={i} src={src} alt={`${item.business_name ?? "photo"} ${i + 1}`} />
              ))}
            </div>
          ) : (
            <div>not provided</div>
          )}
        </div>
      </div>
    </div>
  );
}
