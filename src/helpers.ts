export function percentToColor(p: number) :string{
  if (p>=95){
    return '#29E83C';
  } else if (p>=90){
    return '#B6E829';
  } else if (p>=85) {
    return '#E8E029';
  } else if (p >=80) {
    return '#E8C929';
  } else if (p >=75) {
    return '#E8A729';
  } else if (p >=70) {
    return '#E87929';
  } else {
    return '#E84029';
  }

}