import { CryptoAsset, WeatherData } from '../types';
import { formatPrice } from '../vscode';

interface Props {
  weather: WeatherData | null;
  assets: CryptoAsset[];
}

const PREFERRED = ['btc', 'eth', 'sol', 'bnb', 'xrp'];

export function Ticker({ weather, assets }: Props) {
  const ordered = [...assets].sort((a, b) => {
    const ai = PREFERRED.indexOf(a.symbol.toLowerCase());
    const bi = PREFERRED.indexOf(b.symbol.toLowerCase());
    const av = ai === -1 ? 99 : ai;
    const bv = bi === -1 ? 99 : bi;
    return av - bv;
  }).slice(0, 8);

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {weather && (
          <div className="ticker-card">
            <span className="live">LIVE</span>
            <div className="sym">{(weather.location || 'LONDON, UK').toUpperCase()}</div>
            <div className="price">{Math.round(weather.temperature)}°</div>
            <div className="cond">{weather.condition}</div>
          </div>
        )}
        {ordered.map((asset) => {
          const chg = asset.price_change_percentage_24h || 0;
          const up = chg >= 0;
          return (
            <div key={asset.id} className={`ticker-card ${up ? 'up' : 'down'}`}>
              <span className={`dot-ind ${up ? 'up' : 'down'}`} />
              <div className="sym">{asset.symbol.toUpperCase()}</div>
              <div className="price">{formatPrice(asset.current_price)}</div>
              <div className={`chg ${up ? 'up' : 'down'}`}>
                {up ? '+' : ''}
                {chg.toFixed(2)}%
              </div>
            </div>
          );
        })}
        {!weather && ordered.length === 0 && (
          <div className="ticker-card">
            <div className="sym">MARKETS</div>
            <div className="cond">Loading live data…</div>
          </div>
        )}
      </div>
    </div>
  );
}
