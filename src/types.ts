export type CameraStatus = "online" | "offline";

/**
 * Камерын үндсэн мэдээлэл. UbCam-ийн data/cameras.json яг энэ хэлбэртэй.
 *
 * `id` нь урсгалын нэр мөн — видеоны хаяг `${whepBase}/${id}/whep`
 * гэж шууд үүснэ. `ch01` маягийн нэр бүү өг: AIVA analyzer "ch"+тоо
 * агуулсан нэрийг өөрийнхөөрөө тайлбарлаж урсгалыг өөр тийш чиглүүлдэг.
 */
export type Camera = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: CameraStatus;
};
