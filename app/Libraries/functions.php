<?php
/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 11/07/15
 * Time: 23:48
 */

use App\Object;
use App\ObjectMeta;
use App\Helpers\Thumbnail;


function getImageSrc($imageId, $size = null) {
    if ($image = Object::find($imageId)) {
        if ($imageInfo = ObjectMeta::getValue($image->id, '_image_info')) {
            $imageInfoData = unserialize($imageInfo);

            if (!empty($size) && isset($imageInfoData['sizes'][$size])) {
                $imageSizeInfoData = &$imageInfoData['sizes'][$size];
                if (!empty($imageSizeInfoData)) {
                    $fileName = &$imageSizeInfoData['fileName'];

                    if (!empty($fileName)) {
                        return $fileName;
                    }
                }
            } else {
                $filePath = &$imageInfoData['filePath'];

                return $filePath;
            }
        }
    }
}

function getImageTag($imageId, $size) {
    if ($imageSrc = getImageSrc($imageId, $size)) {
        return sprintf( '<img src="%s" alt="" title="" />',
            URL::to('/public/' . $imageSrc));
    }
}

function addImage($object, $destinationPath, $picture, $filename, $newfileName, $extension, $mimeType, $fieldName) {
    list($source_image_width, $source_image_height, $source_image_type) = getimagesize($destinationPath . $picture);

    $imageObjectInfo = array();
    $imageObjectInfo['width'] = $source_image_width;
    $imageObjectInfo['height'] = $source_image_height;
    $imageObjectInfo['fileName'] = $filename;
    $imageObjectInfo['filePath'] = $newfileName . '.' . $extension;
    $imageObjectInfo['sizes'] = array();

    $x = autoCrop($destinationPath, $picture, $fieldName);

    if($x !== false)
    {
        $round = ((integer) \App\ResizesTinypng::max('round')) + 1;
        insertIntoTableResizes($round, getTheImageSize($picture, $fieldName), $destinationPath . 'cropped/' . getTheImageSize($picture, $fieldName), 0, 'N', 0, false);
        $results_table = selectByRoundNumber($round);

        if (!empty($results_table)) {
            foreach($results_table as $res_row)
            {
                $result_array = array(
                    'id' => intval($res_row['id']),
                    'round' => intval($res_row['round']),
                    'filename' => $res_row['file_name'],
                    'path' => $res_row['path'], //path to image
                    'runTiny' => intval($res_row['run_tiny']),
                    'error' => $res_row['error'],
                    'timeTiny' => intval($res_row['time_tiny']),
                    'timeAdded' => intval($res_row['created_at'])
                );
                $row_obj = array_to_object($result_array);
                $error_message = "N";

                //START >> tinify images
                $tmp_path = str_replace(getcwd() . '/', "", $row_obj->path);//GET SERVER PATH
                $save_path = str_replace($row_obj->filename, "", $tmp_path);//OVERRIDE CURRENT LOCATION
                $flag = tinifyImage($row_obj->path, $save_path);
                if ($flag === false) {
                    if ($error_message == "N") {
                        $error_message = "Y - Compression failed";
                    } else {
                        $error_message .= " - Compression failed";
                    }
                }
                //END << tinify image

                //UPDATE DB
                updateTableResizes($row_obj->id, $row_obj->round, $row_obj->filename, $row_obj->path, 1, $error_message, time(), $row_obj->timeAdded);
            }
        }
    }
    /*
    if ($source_image_width > 1920) {//} || $source_image_height > 1080) {
        Thumbnail::generate_image_thumbnail($destinationPath . $picture, $destinationPath . $newfileName . '-resized.'. $extension, 1920, 1080);

        list($siw, $sih, $sit) = getimagesize($destinationPath . $newfileName . '-resized.'. $extension);

        rename( $destinationPath . $newfileName . '-resized.'. $extension,
            $destinationPath . $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension);

        $imageInfo = array();

        $imageInfo['fileName'] = $destinationPath . $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension;
        $imageInfo['width'] = $siw;
        $imageInfo['height'] = $sih;
        $imageInfo['mimeType'] = $mimeType;

        $imageObjectInfo['sizes']['large'] = $imageInfo;
    }

    if ($source_image_width > 1024) { // || $source_image_height > 768) {
        Thumbnail::generate_image_thumbnail($destinationPath . $picture, $destinationPath . $newfileName . '-resized.'. $extension, 1024, 768);

        list($siw, $sih, $sit) = getimagesize($destinationPath . $newfileName . '-resized.'. $extension);

        rename( $destinationPath . $newfileName . '-resized.'. $extension,
            $destinationPath . $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension);

        $imageInfo = array();

        $imageInfo['fileName'] = $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension;
        $imageInfo['width'] = $siw;
        $imageInfo['height'] = $sih;
        $imageInfo['mimeType'] = $mimeType;

        $imageObjectInfo['sizes']['medium'] = $imageInfo;
    }

    if ($source_image_width > 350) {//|| $source_image_height > 350) {
        Thumbnail::generate_image_thumbnail($destinationPath . $picture, $destinationPath . $newfileName . '-resized.'. $extension, 350, 350);

        list($siw, $sih, $sit) = getimagesize($destinationPath . $newfileName . '-resized.'. $extension);

        rename( $destinationPath . $newfileName . '-resized.'. $extension,
            $destinationPath . $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension);

        $imageInfo = array();

        $imageInfo['fileName'] = $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension;
        $imageInfo['width'] = $siw;
        $imageInfo['height'] = $sih;
        $imageInfo['mimeType'] = $mimeType;

        $imageObjectInfo['sizes']['small'] = $imageInfo;
    }

    if ($source_image_width > 300) {//|| $source_image_height > 350) {
        Thumbnail::generate_image_thumbnail($destinationPath . $picture, $destinationPath . $newfileName . '-resized.'. $extension, 300, 300);

        list($siw, $sih, $sit) = getimagesize($destinationPath . $newfileName . '-resized.'. $extension);

        rename( $destinationPath . $newfileName . '-resized.'. $extension,
            $destinationPath . $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension);

        $imageInfo = array();

        $imageInfo['fileName'] = $newfileName . '-'. $siw . 'x'. $sih .  '.'. $extension;
        $imageInfo['width'] = $siw;
        $imageInfo['height'] = $sih;
        $imageInfo['mimeType'] = $mimeType;

        $imageObjectInfo['sizes']['thumbnail'] = $imageInfo;
    }

    */

    // Save image object
    if ($imageObjectId = ObjectMeta::getValue($object->id, $fieldName)) {
        $imageObject = Object::find($imageObjectId);
    }
    if (empty($imageObject)) {
        $imageObject = new Object();
    }

    $imageObject->author_id = Auth::user()->id;
    $imageObject->type = 'image';
    $imageObject->name = $newfileName . '.' . $extension;
    $imageObject->title = $filename;
    $imageObject->status = 'inherit';
    $imageObject->guid = $newfileName;
    $imageObject->save();

    ObjectMeta::setValue($imageObject->id, '_file_path', $newfileName . '.' . $extension);
    ObjectMeta::setValue($imageObject->id, '_image_info', serialize($imageObjectInfo));

    ObjectMeta::setValue($object->id, $fieldName, $imageObject->id);

    return $imageObject;
}

function autoCrop($destinationPath = null, $img, $type)
{
    $DS = DIRECTORY_SEPARATOR;
    $currentDir = $destinationPath ?: getcwd().$DS.'uploads';
    $img = $currentDir.$DS.$img;

    if(!file_exists($img))
        return false;

    $cropArray = array(
        '_content_image' => array(
            'name'      => 'רגיל',
            'fileKey'   => '_content_image',
            'width'     => '535' * 1.2,
            'height'    => '323' * 1.2,
        ),
        '_featured_image' => array(
            'name'      => 'תמונה קטנה',
            'fileKey'   => '_featured_image',
            'width'     => '250' * 1.2,
            'height'    => '250' * 1.2,
        )
    );

    if(!is_array($cropArray) || empty($cropArray))
        return false;

    if(!isset($cropArray[$type]))
        return false;

    $cropArray = array(
        $type => $cropArray[$type],
    );

    if(!is_dir($currentDir.$DS.'cropped'))
        mkdir($currentDir.$DS.'cropped');

    $saveFolder = $currentDir.$DS.'cropped'.$DS;

    $jpeg_quality = 90;
    $png_quality = 8;

    // Image data
    $src = $img;
    $fileInfo = pathinfo($src);
    $imgData = getimagesize($src);
    $imgWidth  = $imgData[0];
    $imgHeight = $imgData[1];
    $source_type = $imgData[2];

    // Get the image ratio
    $imageRatio = $imgWidth / $imgHeight;

    // run on each crop
    foreach($cropArray as $cropKey => $cropData)
    {
        // New image name
        $newImageName = $saveFolder.$fileInfo['filename'].'_'.$cropKey.'.'.$fileInfo['extension'];

        // if the new image exists do not crop
        if(file_exists(($newImageName)))
            continue;

        // store the crop size in vars
        $orig_w = $targ_w = $cropData['width'];
        $orig_h = $targ_h = $cropData['height'];

        // if crop width bigger then the image width or the height is bigger then the image height continue to the next crop
        if($targ_w > $imgWidth || $targ_h > $imgHeight)
            continue;

        // If the crop matches the exact ratio like the image + 0.03 -
        // Just resize to the crop size
        $currentCropRatio = $targ_w / $targ_h;

        if(
            round($imageRatio,2) < (round($currentCropRatio,2) + 0.03) && round($imageRatio,2) > (round($currentCropRatio,2) - 0.03)
        )
        {


            if($source_type == IMAGETYPE_GIF && 0) // Disabled!
            {
                $imagick = new Imagick($src);
                $imagick = $imagick->coalesceImages();
                do {
                    $imagick->resizeImage($targ_w, $targ_h, Imagick::FILTER_BOX, 1);
                } while ($imagick->nextImage());
                $imagick = $imagick->deconstructImages();
                $imagick->writeImages($newImageName, true);

//                scaleImageFile($src,$targ_w,$targ_h,$newImageName,3);
            }
            else
            {
                // Create the new image based on the image type
                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        $img_resource = imagecreatefromgif($src);
                        break;
                    case IMAGETYPE_JPEG:
                        $img_resource = imagecreatefromjpeg($src);
                        break;
                    case IMAGETYPE_PNG:
                        $img_resource = imagecreatefrompng($src);
                        break;
                    default:
                        $img_resource = imagecreatefromstring($src);
                        break;
                }

                // Set the resize sizes
                $resize = imagecreatetruecolor($targ_w, $targ_h);

                if($source_type == IMAGETYPE_PNG)
                {
                    imageAlphaBlending($resize, false);
                    imageSaveAlpha($resize, true);
                }

                // prepare the image
                imagecopyresampled($resize,$img_resource,0,0,0,0,$targ_w,$targ_h,$imgWidth,$imgHeight);

                // save it based on the type
                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        imagegif($resize,$newImageName);
                        break;
                    case IMAGETYPE_JPEG:
                        imagejpeg($resize,$newImageName,$jpeg_quality);
                        break;
                    case IMAGETYPE_PNG:
                        imagepng($resize,$newImageName,$png_quality);
                        break;
                    default:
                        imagejpeg($resize,$newImageName,$jpeg_quality);
                        break;
                }

                $resize = $img_resource = null;
            }
        }
        // Else crop to the maximum optional size and then crop to the crop size
        else
        {

            // get the width and height ration between the image and the crop
            $widthRatio  = $imgWidth / $targ_w;
            $heightRatio = $imgHeight / $targ_h;

            // get the smallest
            $smallestRatio = min ($widthRatio, $heightRatio );

            if($smallestRatio == $widthRatio)
                $finalRatio = $imgWidth / $targ_w;
            else
                $finalRatio = $imgHeight / $targ_h;

            $sizeChanged = true;
            $targ_w = $targ_w * $finalRatio;
            $targ_h = $targ_h * $finalRatio;

            $targ_x = (($imgWidth - $targ_w) / 2);
            $targ_y = (($imgHeight - $targ_h) / 2);

            if(($targ_w + $targ_x) > $imgWidth)
                continue;

            if(($targ_h + $targ_y) > $imgHeight)
                continue;

            $source_type = $imgData[2];
            if ($source_type === NULL)
                continue;

            if($source_type == IMAGETYPE_GIF && 0) // Disabled
            {
                $imagick = new Imagick($src);
                $imagick = $imagick->coalesceImages();

                do {
                    $imagick->cropImage($targ_w, $targ_h, $targ_x, $targ_y);
                    $imagick->setImagePage($targ_w, $targ_h, 0, 0);
                    $imagick->resizeImage($orig_w, $orig_h, Imagick::FILTER_BOX, 1);
                } while ($imagick->nextImage());
                $imagick = $imagick->deconstructImages();
                $imagick->writeImages($newImageName, true);

//                scaleImageFile($src,$targ_w,$targ_h,$saveFolder.$fileInfo['filename'].'_'.$cropKey.'.'.$fileInfo['extension'],5,$orig_w,$orig_h,$targ_x,$targ_y);
            }
            else
            {

                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        $img_resource = imagecreatefromgif($src);
                        break;
                    case IMAGETYPE_JPEG:
                        $img_resource = imagecreatefromjpeg($src);
                        break;
                    case IMAGETYPE_PNG:
                        $img_resource = imagecreatefrompng($src);
                        break;
                    default:
                        $img_resource = imagecreatefromstring($src);
                        break;
                }

                $dst_resource = imagecreatetruecolor( $targ_w, $targ_h);

                if($source_type == IMAGETYPE_PNG)
                {
                    imageAlphaBlending($dst_resource, false);
                    imageSaveAlpha($dst_resource, true);
                }

                imagecopyresampled($dst_resource,$img_resource,0,0,$targ_x,$targ_y,
                    $targ_w,$targ_h,$targ_w,$targ_h);

                $newImageName = $saveFolder.$fileInfo['filename'].'_'.$cropKey.'.'.$fileInfo['extension'];

                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        imagegif($dst_resource,$newImageName);
                        break;
                    case IMAGETYPE_JPEG:
                        imagejpeg($dst_resource,$newImageName,$jpeg_quality);
                        break;
                    case IMAGETYPE_PNG:
                        imagepng($dst_resource,$newImageName,$png_quality);
                        break;
                    default:
                        imagejpeg($dst_resource,$newImageName,$jpeg_quality);
                        break;
                }

                $dst_resource = null;

                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        $img_resource = imagecreatefromgif($newImageName);
                        break;
                    case IMAGETYPE_JPEG:
                        $img_resource = imagecreatefromjpeg($newImageName);
                        break;
                    case IMAGETYPE_PNG:
                        $img_resource = imagecreatefrompng($newImageName);
                        break;
                    default:
                        $img_resource = imagecreatefromstring($newImageName);
                        break;
                }

                $resize = imagecreatetruecolor($orig_w, $orig_h);

                if($source_type == IMAGETYPE_PNG)
                {
                    imageAlphaBlending($img_resource, false);
                    imageSaveAlpha($img_resource, true);
                }

                imagecopyresampled($resize,$img_resource,0,0,0,0,$orig_w,$orig_h,$targ_w,$targ_h);

                switch ($source_type) {
                    case IMAGETYPE_GIF:
                        imagegif($resize,$newImageName);
                        break;
                    case IMAGETYPE_JPEG:
                        imagejpeg($resize,$newImageName,$jpeg_quality);
                        break;
                    case IMAGETYPE_PNG:
                        imagepng($resize,$newImageName,$png_quality);
                        break;
                    default:
                        imagejpeg($resize,$newImageName,$jpeg_quality);
                        break;
                }
            }
        }
        $fileInfo = $imgData = $img_resource = $resize = NULL;
    }
}

/**
 * @param $singleImage, the image name
 * @param $cropType, what to add in the end of the image name;
 *      example:
 *          $singleImage = "image.jpg";
 *          $cropType    = "xxx";
 *          return:
 *              "image_xxx.jpg"
 *
 * @return string, the new image name
 */
function getTheImageSize($singleImage, $cropType)
    {
        // Explode the image to get ext
        $image = explode('.',$singleImage);
        // store the extension
        $ext = array_pop($image);
        // combine the image with the crop type
        $image[count($image)-1] = $image[count($image)-1].'_'.$cropType;
        // push the ext back
        array_push($image, $ext);
        // return the imploded image by "."
        return implode('.',$image);
    }

/* Tiny png functions */
/**
 * @return int
 */
function getRoundNumber()
{
    return (integer) \App\ResizesTinypng::max('round');
}

/**
 * @param $round
 * @return bool|mysqli_result
 */
function selectByRoundNumber($round)
{

    return \App\ResizesTinypng::where('round', $round)->where('run_tiny', 0)->get()->toArray();
}

/**
 * @param $round
 * @return bool|mysqli_result
 */
function selectFailedByRoundNumber($round)
{
    return \App\ResizesTinypng::where('round', $round)->where('error', 'LIKE', '%Y%')->get()->toArray();
}

/**
 * @param $round
 * @return int
 */
function countAllByRoundNumber($round)
{
    return (integer) \App\ResizesTinypng::where('round', $round)->count();
}

/**
 * @param $round
 * @return int
 */
function countSuccessfulByRoundNumber($round)
{
    return (integer) \App\ResizesTinypng::where('round', $round)->where('error', 'N')->where('run_tiny', 1)->count();
}

/**
 * @param $round
 * @return int
 */
function countFailedByRoundNumber($round)
{
    return (integer) \App\ResizesTinypng::where('round', $round)->where('error', 'LIKE', '%Y%')->count();
}

/**
 * @param $round
 * @param $filename
 * @param $path
 * @param $runTiny
 * @param $error
 * @param $timeTiny
 * @param $timeAdded
 */
function insertIntoTableResizes($round, $filename, $path, $runTiny, $error, $timeTiny, $timeAdded)
{
    \App\ResizesTinypng::create([
        'round'     =>  $round,
        'file_name' =>  $filename,
        'path'      =>  $path,
        'run_tiny'  =>  $runTiny,
        'error'     =>  $error,
        'time_tiny' =>  $timeTiny
    ]);
}

/**
 * @param $id
 * @param $round
 * @param $filename
 * @param $path
 * @param $runTiny
 * @param $error
 * @param $timeTiny
 * @param $timeAdded
 */
function updateTableResizes($id, $round, $filename, $path, $runTiny, $error, $timeTiny, $timeAdded)

{
    $item = \App\ResizesTinypng::find($id);
    $item->round        = $round;
    $item->file_name    = $filename;
    $item->path         = $path;
    $item->run_tiny     = $runTiny;
    $item->error        =$error;
    $item->time_tiny    = $timeTiny;
    $item->save();
}

/**
 * FUNCTION #2
 * This function uses expandDirectories
 * @param $path
 * @param $skip - skip images that were already resized, default true
 * @return array
 */
function getAllImageFilesInPath($path, $skip = true)
{
    $goodFiles = array();
    $result_array = array();
    $path = realpath($path);
    $directories_array = expandDirectories($path);
    if (is_dir($path)) {
        $directories_array[] = $path;
        sort($directories_array);
    }
    foreach ($directories_array as $folder) {
        //Skip images that were already resized
        if ($skip) {
            if (strpos($folder, 'output') !== false) continue;
        }
        foreach (scandir($folder) as $file) {
            $f = explode('.', $file);
            $c = count($f) - 1;
            if ($f[$c] !== 'png' && $f[$c] !== 'pneg' && $f[$c] !== 'jpeg' && $f[$c] !== 'jpg' && $f[$c] !== 'gif') continue;
            $goodFiles[] = $folder . '/' . $file;
        }
    }
    foreach ($goodFiles as $file_path) {
//        $file = imageCreateFromAny($file_path);
        $error = "N";
//        if (!$file) {
//            $error = "Y";
//        }
        $result_array[] = array(
            'real_path' => $file_path,
            'filename' => basename($file_path),
//            'file' => $file,
            'error' => $error
        );
    }
    return $result_array;
}

/**
 * @param $base_dir
 * @return array
 */
function expandDirectories($base_dir)
{
    $directories = array();
    foreach (scandir($base_dir) as $file) {
        if ($file == '.' || $file == '..') continue;
        $dir = $base_dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($dir)) {
            $directories [] = $dir;
            $directories = array_merge($directories, expandDirectories($dir));
        }
    }
    return $directories;
}

/**
 * @param $array
 * @return object
 */
function array_to_object($array)
{
    return (object)$array;
}

/**
 * FUNCTION #1
 * @param $real_path - the full path to image or url to image
 * @param string $save_path - where to save the new image,  default is to override current location
 * @param string $output_new - new image file name, default is same name as input image
 * @return bool
 */
function tinifyImage($real_path, $save_path = '', $output_new = '')
{
    /* This only works if the title and its tags are on one line */
    $input = basename($real_path);
    if (empty($output_new)) {
        $output = $input;
    } else {
        $output = $output_new;
    }

//    $key = "DapPHppTkF3aAXPi46wkOqcxhm1GiFuB";
//    $key = "0C4ZaQsz0fnSCvbseT2usUBBjcTrQVC9";
    $key = "q_3X61dIcoTSQYHhNMbhlQHtOPs-h1TP";

    $url = "https://api.tinify.com/shrink";
    $options = array(
        "http" => array(
            "method" => "POST",
            "header" => array(
                "Content-type: image/png",
                "Authorization: Basic " . base64_encode("api:$key")
            ),
            "content" => file_get_contents($real_path)
        ),
        "ssl" => array(
            /* Uncomment below if you have trouble validating our SSL certificate.
               Download cacert.pem from: http://curl.haxx.se/ca/cacert.pem */
            "cafile" => __DIR__ . "/cacert.pem",
            "verify_peer" => true
        )
    );

    $result = fopen($url, "r", false, stream_context_create($options));
    if ($result) {
        /* Compression was successful, retrieve output from Location header. */
        foreach ($http_response_header as $header) {
            if (!empty($save_path)) {
                if (!is_dir($save_path)) {
                    // dir doesn't exist, make it
                    mkdir($save_path);
                }
            }
            if (strtolower(substr($header, 0, 10)) === "location: ") {
                file_put_contents($save_path . $output, fopen(substr($header, 10), "rb", false));
            }
        }
//        print("Compression successful\n");
        return true;
    } else {
        /* Something went wrong! */
//        print("Compression failed\n");
        return false;
    }
}
