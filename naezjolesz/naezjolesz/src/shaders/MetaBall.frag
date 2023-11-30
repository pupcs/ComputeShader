#version 410
precision highp float;

struct Material {
    vec3 ka, kd, ks;
    float  shininess;
    vec3 F0;
    int rough, reflective;
};

struct Light {
    vec3 direction;
    vec3 Le, La;
};

struct Sphere {
    vec3 center;
    float radius;
};

struct Hit {
    float t;
    vec3 position, normal;
    int mat;	// material index
};

struct Ray {
    vec3 start, dir;
};

const int nMaxObjects = 500;

uniform vec3 wEye;
uniform Light light;
uniform Material materials[2];  // diffuse, specular, ambient ref
uniform int nObjects;
uniform Sphere objects[nMaxObjects];

in  vec3 p;					// point on camera window corresponding to the pixel
out vec4 fragmentColor;		// output that goes to the raster memory as told by glBindFragDataLocation

float f(vec3 p) {
    float sum = 0.0;
    for (int i = 0; i < nObjects; i++) {
        vec3 d = p - objects[i].center;
        sum += objects[i].radius / dot(d, d);
    }
    return sum;
}

Hit intersect(const Sphere object,const Ray ray) {
    Hit hit;
    hit.t = -1;
    float t = 0.0;
    for (int i = 0; i < 100; i++) { // maximum 100 lépés
        vec3 p = ray.start + ray.dir * t;
        float f_value = f(p) - 1.0; // az 1.0 a küszöbérték
        if (abs(f_value) < 0.01) { // ha elég közel vagyunk a felülethez
            hit.t = t;
            hit.position = p;
            // a normálvektor kiszámítása numerikus deriválással
            float eps = 0.001; // a deriválás pontossága
            vec3 dx = vec3(eps, 0, 0);
            vec3 dy = vec3(0, eps, 0);
            vec3 dz = vec3(0, 0, eps);
            hit.normal = normalize(vec3(
            f(p + dx) - f(p - dx),
            f(p + dy) - f(p - dy),
            f(p + dz) - f(p - dz)
            ));
            return hit;
        }
        t += f_value;
    }
    return hit;
}

Hit firstIntersect(Ray ray) {
    Hit bestHit;
    bestHit.t = -1;
    for (int o = 0; o < nObjects; o++) {
        Hit hit = intersect(objects[o], ray); //  hit.t < 0 if no intersection
        if (o < nObjects/2) hit.mat = 0;	 // half of the objects are rough
        else			    hit.mat = 1;     // half of the objects are reflective
        if (hit.t > 0 && (bestHit.t < 0 || hit.t < bestHit.t))  bestHit = hit;
    }
    if (dot(ray.dir, bestHit.normal) > 0) bestHit.normal = bestHit.normal * (-1);
    return bestHit;
}

bool shadowIntersect(Ray ray) {	// for directional lights
    for (int o = 0; o < nObjects; o++) if (intersect(objects[o], ray).t > 0) return true; //  hit.t < 0 if no intersection
    return false;
}

vec3 Fresnel(vec3 F0, float cosTheta) {
    return F0 + (vec3(1, 1, 1) - F0) * pow(cosTheta, 5);
}

const float epsilon = 0.0001f;
const int maxdepth = 5;

vec3 trace(Ray ray) {
    vec3 weight = vec3(1, 1, 1);
    vec3 outRadiance = vec3(0, 0, 0);
    for(int d = 0; d < maxdepth; d++) {
        Hit hit = firstIntersect(ray);
        if (hit.t < 0) return weight * light.La;
        if (materials[hit.mat].rough == 1) {
            outRadiance += weight * materials[hit.mat].ka * light.La;
            Ray shadowRay;
            shadowRay.start = hit.position + hit.normal * epsilon;
            shadowRay.dir = light.direction;
            float cosTheta = dot(hit.normal, light.direction);
            if (cosTheta > 0 && !shadowIntersect(shadowRay)) {
                outRadiance += weight * light.Le * materials[hit.mat].kd * cosTheta;
                vec3 halfway = normalize(-ray.dir + light.direction);
                float cosDelta = dot(hit.normal, halfway);
                if (cosDelta > 0) outRadiance += weight * light.Le * materials[hit.mat].ks * pow(cosDelta, materials[hit.mat].shininess);
            }
        }

        if (materials[hit.mat].reflective == 1) {
            weight *= Fresnel(materials[hit.mat].F0, dot(-ray.dir, hit.normal));
            ray.start = hit.position + hit.normal * epsilon;
            ray.dir = reflect(ray.dir, hit.normal);
        } else return outRadiance;
    }
}

void main() {
    Ray ray;
    ray.start = wEye;
    ray.dir = normalize(p - wEye);
    fragmentColor = vec4(trace(ray), 1);
}