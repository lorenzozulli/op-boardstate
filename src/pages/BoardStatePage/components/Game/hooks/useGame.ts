import { useTranslation } from "react-i18next"

export const useGame = () => {
  const { t } = useTranslation('game');

  return { t };
}
