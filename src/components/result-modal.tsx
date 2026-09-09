import type { SearchResult } from "../types";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImageWithFallback from './image-with-fallback';

interface Props {
  item: SearchResult;
  onClose: () => void;
}

const formatFeatureName = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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
        <div className="modal__header">
          <div className="modal__title-group">
            <h2 className="modal__title" title={item.business_name ?? "not provided"}>{item.business_name ?? "not provided"}</h2>
            <p className="modal__subtitle" title={`${street}, ${state}`}>{street}, {state}</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal__content">
          {photos.length > 0 && (
            <div className="modal__section">
              <span className="modal__section-title">Gallery</span>
              <div className="modal__gallery">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  style={{ width: '100%', paddingBottom: '30px' }}
                >
                  {photos.map((src, i) => (
                    <SwiperSlide key={i}>
                      <ImageWithFallback src={src} alt={`${item.business_name ?? "photo"} ${i + 1}`} loading="lazy" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          <div className="modal__section">
            <span className="modal__section-title">Description</span>
            <div
              className="modal__description"
              dangerouslySetInnerHTML={{ __html: desc === "not provided" ? "<p>No description provided.</p>" : desc }}
            />
          </div>

          <div className="modal__section">
            <span className="modal__section-title">Facilities</span>
            {facilitiesEntries ? (
              <div className="modal__facilities-wrapper">
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
                        <td>{formatFeatureName(k)}</td>
                        <td>{v === true || String(v) === "true" ? "Yes" : String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="modal__description"><p>No facilities listed.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
