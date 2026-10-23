import { Heart } from "lucide-react";
import { Card, IconButton, Tag, Thumbnail } from "../base";

export type RestaurantCardData = { badge?: string; distance: string; fee: string; image: string; name: string; rating: string; reviews: string; time: string };

/** Place card for Delivery discovery, built on the same card, image and tag primitives as the menu. */
export function RestaurantCard({ favorite, onToggleFavorite, restaurant }: { favorite: boolean; onToggleFavorite: () => void; restaurant: RestaurantCardData }) {
  return (
    <Card className="wa-restaurant-card">
      <span className="wa-restaurant-card__media">
        <Thumbnail size="tile" src={restaurant.image} />
        {restaurant.badge ? <Tag className="wa-restaurant-card__tag" tone="inverse">{restaurant.badge}</Tag> : null}
      </span>
      <div className="wa-restaurant-card__body">
        <div className="wa-restaurant-card__heading">
          <h3>{restaurant.name}</h3>
          <IconButton className={favorite ? "wa-restaurant-card__favorite--active" : undefined} label={`${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${restaurant.name}`} onPress={onToggleFavorite} size="sm">
            <Heart aria-hidden="true" fill={favorite ? "currentColor" : "none"} size={20} strokeWidth={1.8} />
          </IconButton>
        </div>
        <p className="wa-restaurant-card__meta"><strong>★ {restaurant.rating}</strong> {restaurant.reviews} · {restaurant.distance} · {restaurant.time}</p>
        <p className="wa-restaurant-card__fee">{restaurant.fee}</p>
      </div>
    </Card>
  );
}
